import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { ease } from './Reveal';

interface FlyCodeLine {
  file: string;
  tag: string;
  ln: string;
  text: string;
}

const TOP_FLY_LINES: FlyCodeLine[] = [
  {
    file: 'Program.cs',
    tag: 'ASP.NET Core 8',
    ln: '01',
    text: 'var builder = WebApplication.CreateBuilder(args);',
  },
  {
    file: 'Program.cs',
    tag: 'Architecture',
    ln: '02',
    text: 'builder.Services.AddCleanArchitecture(builder.Configuration);',
  },
  {
    file: 'Program.cs',
    tag: 'Security · JWT',
    ln: '03',
    text: 'builder.Services.AddJwtBearerAuth().AddRateLimiting();',
  },
  {
    file: 'EndpointPipeline.cs',
    tag: 'Authorization',
    ln: '08',
    text: '[Authorize(Policy = "ResourceOwnerVerified")]',
  },
  {
    file: 'AppDbContext.cs',
    tag: 'PostgreSQL',
    ln: '15',
    text: 'services.AddDbContextPool<AppDbContext>(o => o.UseNpgsql(cs));',
  },
  {
    file: 'CreateProjectHandler.cs',
    tag: 'DDD · CQRS',
    ln: '24',
    text: 'var project = Project.Create(cmd.Name, cmd.TenantId);',
  },
  {
    file: 'OrderHandler.cs',
    tag: 'MediatR',
    ln: '29',
    text: 'await _mediator.Send(new VerifyShipmentCmd(orderId), ct);',
  },
  {
    file: 'OrderHub.cs',
    tag: 'SignalR · Real-Time',
    ln: '31',
    text: 'await Clients.Group(tenant).SendAsync("OrderSynced", dto, ct);',
  },
  {
    file: 'Program.cs',
    tag: 'Observability',
    ln: '52',
    text: 'app.UseExceptionHandler().UseSerilogRequestLogging();',
  },
];

/** Lightweight C# syntax highlighter for crisp developer presentation. */
function highlightCSharp(line: string) {
  const tokenRe =
    /(".*?"|\[(?:Authorize|ApiController|HttpGet|HttpPost)\b|\b(?:var|public|sealed|class|async|Task|return|await|new|where|typeof)\b|\b(?:WebApplication|IUnitOfWork|Project|ProjectCreatedDomainEvent|Result|AppDbContext|OrderDispatchedEvent|VerifyShipmentCmd)\b)/g;
  const parts = line.split(tokenRe);
  return parts.map((part, idx) => {
    if (!part) return null;
    if (part.startsWith('"')) {
      return (
        <span key={idx} className="code-tok--str">
          {part}
        </span>
      );
    }
    if (part.startsWith('[')) {
      return (
        <span key={idx} className="code-tok--attr">
          {part}
        </span>
      );
    }
    if (/^(var|public|sealed|class|async|Task|return|await|new|where|typeof)$/.test(part)) {
      return (
        <span key={idx} className="code-tok--kw">
          {part}
        </span>
      );
    }
    if (
      /^(WebApplication|IUnitOfWork|Project|ProjectCreatedDomainEvent|Result|AppDbContext|OrderDispatchedEvent|VerifyShipmentCmd)$/.test(
        part,
      )
    ) {
      return (
        <span key={idx} className="code-tok--type">
          {part}
        </span>
      );
    }
    return <span key={idx}>{part}</span>;
  });
}

/**
 * Top-corner auto-writing C# / .NET 8 flying code stream.
 */
export function FloatingCodeStreams() {
  const [topIdx, setTopIdx] = useState(0);
  const [topChar, setTopChar] = useState(0);

  const currentTop = TOP_FLY_LINES[topIdx];
  const isTopDone = topChar >= currentTop.text.length;

  useEffect(() => {
    if (!isTopDone) {
      const t = setTimeout(() => {
        setTopChar((c) => Math.min(currentTop.text.length, c + 1));
      }, 30);
      return () => clearTimeout(t);
    }
    const hold = setTimeout(() => {
      setTopIdx((i) => (i + 1) % TOP_FLY_LINES.length);
      setTopChar(0);
    }, 2200);
    return () => clearTimeout(hold);
  }, [topChar, isTopDone, currentTop]);

  const prevTop = TOP_FLY_LINES[(topIdx - 1 + TOP_FLY_LINES.length) % TOP_FLY_LINES.length];

  return (
    <div className="code-streams" aria-hidden="true">
      {/* Top-Right Corner Auto-Written Fly Lines */}
      <motion.div
        className="fly-corner fly-corner--top-right"
        initial={{ opacity: 0, y: -14, x: 14 }}
        animate={{ opacity: 1, y: 0, x: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.45 }}
      >
        <div className="fly-corner__meta">
          <span className={`fly-corner__pulse ${isTopDone ? 'is-ready' : ''}`} />
          <span className="fly-corner__file">{currentTop.file}</span>
          <span className="fly-corner__badge">{currentTop.tag}</span>
        </div>

        <AnimatePresence mode="popLayout">
          <motion.div
            key={`prev-${prevTop.file}-${prevTop.ln}`}
            layout
            className="fly-pill fly-pill--ghost"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 0.44, y: 0, x: -6, scale: 0.97 }}
            exit={{ opacity: 0, y: -14, filter: 'blur(4px)' }}
            transition={{ duration: 0.45, ease }}
          >
            <span className="fly-pill__ln">{prevTop.ln}</span>
            <code className="fly-pill__code">{highlightCSharp(prevTop.text)}</code>
          </motion.div>
        </AnimatePresence>

        <motion.div layout className="fly-pill fly-pill--active">
          <span className="fly-pill__ln">{currentTop.ln}</span>
          <code className="fly-pill__code">
            {highlightCSharp(currentTop.text.slice(0, topChar))}
            <span className="fly-pill__caret" />
          </code>
        </motion.div>
      </motion.div>
    </div>
  );
}
