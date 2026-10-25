using Microsoft.EntityFrameworkCore;

namespace khalilResume.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<khalilResume.Domain.Products.Product> Products { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}