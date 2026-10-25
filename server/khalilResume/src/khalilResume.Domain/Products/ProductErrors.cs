using khalilResume.Domain.Common.Results;

namespace khalilResume.Domain.Products;

public static class ProductErrors
{
    public static readonly Error NameRequired =
        Error.Validation("Product.NameRequired", "Product name is required.");

    public static readonly Error SkuRequired =
        Error.Validation("Product.SkuRequired", "Product SKU is required.");

    public static readonly Error PriceInvalid =
        Error.Validation("Product.PriceInvalid", "Product price cannot be negative.");

    public static readonly Error ProductNotFound =
        Error.NotFound("Product.NotFound", "The requested product was not found.");

    public static readonly Error SkuAlreadyExists =
        Error.Conflict("Product.SkuExists", "A product with the same SKU already exists.");
}