const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  let body = request.body;
  body = {
    id: uuid(),
    ...body,
    likes: 0
  };
  repositories.push(body);
  return response.status(201).json(body);
});

app.put("/repositories/:id", (request, response) => {
  const paramId = request.params.id;
  if(!isUuid(paramId)){
    return response.status(400).json({"error": "Param is not UUID type"});
  } else {
    const {id, likes, ...bodyWithouLikesAndId} = request.body;
    const repositoryFoundedIndex = repositories.findIndex(r => r.id === paramId);
    if(repositoryFoundedIndex < 0){
      return response.status(400).json({"error": "Repository not founded"});
    } else {
      const repositoryFounded = repositories[repositoryFoundedIndex];
      const updatedRepository = {
        ...repositoryFounded,
        ...bodyWithouLikesAndId
      };
      repositories[repositoryFoundedIndex] = updatedRepository;
      return response.status(200).json(updatedRepository);
    }
  }
});

app.delete("/repositories/:id", (request, response) => {
  const paramId = request.params.id;
  if(!isUuid(paramId)){
    return response.status(400).json({"error": "Param is not UUID type"});
  } else {
    const repositoryFoundedIndex = repositories.findIndex(r => r.id === paramId);
    if(repositoryFoundedIndex < 0){
      return response.status(400).json({"error": "Repository not founded"});
    } else {
      repositories.splice(repositoryFoundedIndex, 1);
      return response.status(204).json({message: "Repository deleted"});
    }
  }
});

app.post("/repositories/:id/like", (request, response) => {
  const paramId = request.params.id;
  if(!isUuid(paramId)){
    return response.status(400).json({"error": "Param is not UUID type"});
  } else {
    const repositoryFoundedIndex = repositories.findIndex(r => r.id === paramId);
    if(repositoryFoundedIndex < 0){
      return response.status(400).json({"error": "Repository not founded"});
    } else {
      const repositoryFounded = repositories[repositoryFoundedIndex];
      const updatedRepository = {
        ...repositoryFounded,
        likes: repositoryFounded.likes + 1
      };
      repositories[repositoryFoundedIndex] = updatedRepository;
      return response.status(200).json(updatedRepository);
    }
  }
});

module.exports = app;
