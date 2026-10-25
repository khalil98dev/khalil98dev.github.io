namespace khalilResume.Contracts.Requests.Products;

public record CreateProductRequest(string Name, string Sku, decimal Price);