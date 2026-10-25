import { Link } from 'react-router-dom';
import { Page } from '@/components/Page';
import { Icon } from '@/components/Icon';

export default function NotFound() {
  return (
    <Page>
      <section className="page-hero center" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
        <div className="container">
          <div className="eyebrow">404</div>
          <h1 className="display">This page wandered off.</h1>
          <p className="lead center-text">The page you’re looking for doesn’t exist or has moved.</p>
          <Link to="/" className="btn btn--primary mt-xl">
            <Icon name="arrowLeft" size={18} /> Back home
          </Link>
        </div>
      </section>
    </Page>
  );
}
