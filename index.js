import express from "express";
import cors from "cors";
const app = express();
import { connectDB } from "./db.js";
import { Card } from "./modelos/Card.js";
app.use(express.json()) 
app.use(cors());
connectDB();


app.post("/cards", async (req, res) =>{ 
try{
  console.log(req.body);
  const card = await Card.create(req.body);
  console.log(card);
  res.status(201).json({Card}).send("Card create succesfully");

} 
catch (error){
}
 });

app.get("/hola", (req, res) => {
  res.status(200).send("hello world form a server!!!");
});

app.post("/send",(req,res) => {
  const {user,email} = req.body;
  console.log("datos recobidos" + user + " " + email )
  res.status(200).send("data recibed susesflly");
});

app.listen(3000, () => {
  console.log("Servidor Ejecutandose servidor en http://localhost:3000")
});

//Create
app.post("/createCard", async (req, res) => {
  try {
    const card = await Card.create(req.body);
    console.log(card);
    // respond with created card
    res.status(201).json(card).send("Card created successfully");
  } catch (error) {
    console.error(error);
    res.status(400).send("Error creating card");
  }
});

app.get("/getAllCards", async (req, res) => {
  try {
    const cards = await Card.find();
    res.status(200).json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving cards");
  }
}); 
app.get("/getCard/:id", async (req, res) => {
  try {
    const { id } = req.params; // obtenemos el ID de la URL
    const cards = await Card.findById(id);
    if (!cards) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json(cards);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error retrieving cards");
  }
}); 

//UPDATE
app.put("/updateAllcards/:id", async (req, res) => {
  try {
    const { id } = req.params; // obtenemos el ID de la URL
    const updates = req.body; //  los campos que quieres actualizar

    
    const updatedCard = await Card.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json({
      message: "Card updated successfully",
      data: updatedCard,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating card" });
  }
});


app.delete("/deleteCards/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    const deletedCard = await Card.findByIdAndDelete(id); 

    if (!deletedCard) {
      return res.status(404).json({ message: "Card not found" });
    }
    res.status(200).json({ message: "Card deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error deleting card" });
  }
});

app.patch("/updateCard/:id", async (req, res) => {
  try {
    const { id } = req.params; 
    const updates = req.body;  

    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    
    const updatedCard = await Card.findByIdAndUpdate(id, updates, {
      new: true,           
      runValidators: true, 
    });

    if (!updatedCard) {
      return res.status(404).json({ message: "Card not found" });
    }

    res.status(200).json({
      message: "Card updated successfully",
      data: updatedCard,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error updating card",
      error: error.message,
    });
  }
});

app.get("/review", (req, res) => {
  const message = `
    Endpoints disponibles:
    - POST /cards → Crear una tarjeta (createCard)
    - GET /getAllCards → Obtener todas las tarjetas (getCards)
    - GET /getCard/:id → Obtener una tarjeta por ID (getCard)
    - PUT /updateAllcards/:id → Actualizar toda una tarjeta (updateCard)
    - PATCH /updateCard/:id → Actualizar parcialmente una tarjeta (updateCard parcial)
    - DELETE /deleteCards/:id → Eliminar una tarjeta (deleteCard)
  `;

  res.status(200).send(message);
});

app.patch("/updateLike/:id", async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);

    if (!card) {
      return res.status(404).json({ message: "Card not found" });
    }

    // Cambiar el like
    card.like = !card.like;

    // Guardar en la BD
    await card.save();

    res.json(card);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});