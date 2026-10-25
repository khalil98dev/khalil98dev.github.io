using khalilResume.Domain.Products;
using Xunit;

namespace khalilResume.Domain.UnitTests;

public class ProductTests
{
    [Fact]
    public void CreateProduct_WithValidData_ShouldSucceed()
    {
        var result = Product.Create(Guid.NewGuid(), "Laptop", "TECH-001", 1200m);

        Assert.True(result.IsSuccess);
        Assert.Equal("Laptop", result.Value.Name);
        Assert.Equal("TECH-001", result.Value.Sku);
        Assert.Single(result.Value.DomainEvents);
    }

    [Fact]
    public void CreateProduct_WithEmptyName_ShouldReturnError()
    {
        var result = Product.Create(Guid.NewGuid(), "", "TECH-001", 1200m);

        Assert.True(result.IsError);
        Assert.Equal(ProductErrors.NameRequired.Code, result.TopError.Code);
    }
}