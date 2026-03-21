using backend.Data;
using backend.Dtos;
using backend.Models;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers;

[ApiController]
[Route("api/cart")]
public class CartController : ControllerBase
{
    private readonly MarketplaceContext _context;
    private readonly IValidator<AddToCartRequest> _addValidator;
    private readonly IValidator<UpdateCartItemRequest> _updateValidator;
    private const string CurrentUserId = "default-user";

    public CartController(
        MarketplaceContext context,
        IValidator<AddToCartRequest> addValidator,
        IValidator<UpdateCartItemRequest> updateValidator)
    {
        _context = context;
        _addValidator = addValidator;
        _updateValidator = updateValidator;
    }

    [HttpGet]
    public async Task<ActionResult<CartResponse>> GetCart()
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .ThenInclude(i => i.Product)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart == null) return NotFound();

        return Ok(MapToCartResponse(cart));
    }

    [HttpPost]
    public async Task<ActionResult<CartItemResponse>> AddToCart(AddToCartRequest request)
    {
        var validation = await _addValidator.ValidateAsync(request);
        if (!validation.IsValid)
            return BadRequest(validation.Errors.Select(e => e.ErrorMessage));

        var product = await _context.Products.FindAsync(request.ProductId);
        if (product == null) return NotFound("Product not found.");

        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart == null)
        {
            cart = new Cart { UserId = CurrentUserId };
            _context.Carts.Add(cart);
        }

        var existingItem = cart.Items.FirstOrDefault(i => i.ProductId == request.ProductId);
        if (existingItem != null)
        {
            existingItem.Quantity += request.Quantity;
        }
        else
        {
            existingItem = new CartItem
            {
                ProductId = request.ProductId,
                Quantity = request.Quantity
            };
            cart.Items.Add(existingItem);
        }

        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        await _context.Entry(existingItem).Reference(i => i.Product).LoadAsync();

        return CreatedAtAction(nameof(GetCart), MapToCartItemResponse(existingItem));
    }

    [HttpPut("{cartItemId:int}")]
    public async Task<ActionResult<CartItemResponse>> UpdateCartItem(int cartItemId, UpdateCartItemRequest request)
    {
        var validation = await _updateValidator.ValidateAsync(request);
        if (!validation.IsValid)
            return BadRequest(validation.Errors.Select(e => e.ErrorMessage));

        var cartItem = await _context.CartItems
            .Include(i => i.Cart)
            .Include(i => i.Product)
            .FirstOrDefaultAsync(i => i.Id == cartItemId);

        if (cartItem == null) return NotFound();
        if (cartItem.Cart.UserId != CurrentUserId) return NotFound();

        cartItem.Quantity = request.Quantity;
        cartItem.Cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return Ok(MapToCartItemResponse(cartItem));
    }

    [HttpDelete("{cartItemId:int}")]
    public async Task<IActionResult> RemoveCartItem(int cartItemId)
    {
        var cartItem = await _context.CartItems
            .Include(i => i.Cart)
            .FirstOrDefaultAsync(i => i.Id == cartItemId);

        if (cartItem == null) return NotFound();
        if (cartItem.Cart.UserId != CurrentUserId) return NotFound();

        cartItem.Cart.UpdatedAt = DateTime.UtcNow;
        _context.CartItems.Remove(cartItem);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var cart = await _context.Carts
            .Include(c => c.Items)
            .FirstOrDefaultAsync(c => c.UserId == CurrentUserId);

        if (cart == null) return NotFound();

        _context.CartItems.RemoveRange(cart.Items);
        cart.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private static CartItemResponse MapToCartItemResponse(CartItem item) => new()
    {
        Id = item.Id,
        ProductId = item.ProductId,
        ProductName = item.Product.Name,
        Price = item.Product.Price,
        ImageUrl = item.Product.ImageUrl,
        Quantity = item.Quantity,
        LineTotal = item.Product.Price * item.Quantity
    };

    private static CartResponse MapToCartResponse(Cart cart) => new()
    {
        Id = cart.Id,
        UserId = cart.UserId,
        Items = cart.Items.Select(MapToCartItemResponse).ToList(),
        TotalItems = cart.Items.Sum(i => i.Quantity),
        Subtotal = cart.Items.Sum(i => i.Product.Price * i.Quantity),
        Total = cart.Items.Sum(i => i.Product.Price * i.Quantity),
        CreatedAt = cart.CreatedAt,
        UpdatedAt = cart.UpdatedAt
    };
}
