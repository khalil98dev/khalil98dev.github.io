using khalilResume.Domain.Products;
using Microsoft.EntityFrameworkCore;

namespace khalilResume.Application.Common.Interfaces;

public interface IAppDbContext
{
    DbSet<Product> Products { get; }

    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}