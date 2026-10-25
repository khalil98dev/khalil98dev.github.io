using khalilResume.Domain.Common.Results;
using Xunit;

namespace khalilResume.Domain.UnitTests;

public class ResultTests
{
    [Fact]
    public void SuccessResult_ShouldBeSuccess()
    {
        Result<string> result = "Hello World";

        Assert.True(result.IsSuccess);
        Assert.False(result.IsError);
        Assert.Equal("Hello World", result.Value);
    }

    [Fact]
    public void ErrorResult_ShouldHoldError()
    {
        Result<string> result = Error.NotFound("Item.NotFound", "The item was not found.");

        Assert.False(result.IsSuccess);
        Assert.True(result.IsError);
        Assert.Equal(ErrorKind.NotFound, result.TopError.Type);
    }
}