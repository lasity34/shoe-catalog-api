export default function shoeAPI(shoeService) {
  
    async function getAll(req, res) {
      try {
        const shoes = await shoeService.getAllShoes();
        res.json({ data: shoes });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  
    async function add(req, res) {
      try {
        await shoeService.addShoe(req.body);
        res.json({ message: "Shoe added successfully" });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  
    
    async function getByBrand(req, res) {
      try {
        const shoes = await shoeService.getShoesByBrand(req.params.brand);
        res.json({ data: shoes });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  
    async function getBySize(req, res) {
      try {
        const shoes = await shoeService.getShoesBySize(req.params.size);
        res.json({ data: shoes });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  
    async function getByColor(req, res) {
      try {
        const shoes = await shoeService.getShoesByColor(req.params.color);
        res.json({ data: shoes });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }
  
    async function getByPrice(req, res) {
      try {
        const shoes = await shoeService.getShoesByPrice(req.params.price);
        res.json({ data: shoes });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    }

    async function getFilters(req, res) {
        try {
          const filterData = await shoeService.getFilterData();
          res.status(200).json(filterData);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      }

      async function getFiltered(req, res) {
        try {
            const filters = req.query; // Get filters from query parameters
            const shoes = await shoeService.getFilteredShoes(filters);
            res.json({ data: shoes });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }

    async function addToCart(req, res) {
      try {
          const { shoe_id, quantity, user_id } = req.body;
          await shoeService.addToCart(shoe_id, quantity, user_id);
          res.status(200).json({ message: "Item added to cart" });
      } catch (err) {
          res.status(500).json({ error: err.message });
      }
  }

  async function removeFromCart(req, res) {
      try {
          const { cart_id } = req.params;
          await shoeService.removeFromCart(cart_id);
          res.status(200).json({ message: "Item removed from cart" });
      } catch (err) {
          res.status(500).json({ error: err.message });
      }
  }

  async function updateCartQuantity(req, res) {
      try {
          const { cart_id, newQuantity } = req.body;
          await shoeService.updateCartQuantity(cart_id, newQuantity);
          res.status(200).json({ message: "Cart updated" });
      } catch (err) {
          res.status(500).json({ error: err.message });
      }
  }

  async function getCartItems(req, res) {
      try {
          const { user_id } = req.params;
          const items = await shoeService.getCartItems(user_id);
          res.status(200).json({ data: items });
      } catch (err) {
          res.status(500).json({ error: err.message });
      }
  }

  async function getCartItemCount(req, res) {
      try {
          const { user_id } = req.params;
          const count = await shoeService.getCartItemCount(user_id);
          res.status(200).json({ count });
      } catch (err) {
          res.status(500).json({ error: err.message });
      }
  }

  async function checkout(req, res) {
      try {
          const { user_id } = req.params;
          await shoeService.checkout(user_id);
          res.status(200).json({ message: "Checkout successful" });
      } catch (err) {
          res.status(500).json({ error: err.message });
      }
  }
    
  
    return {
      getAll,
      add,
      getByBrand,
      getBySize,
      getByColor,
      getByPrice,
      getFilters,
      getFiltered
    }
  }
  