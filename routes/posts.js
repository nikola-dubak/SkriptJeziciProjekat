const express = require("express");
const { Posts } = require("../models");
const Joi = require("joi");
require("dotenv").config();

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));

route.get("/posts", async (request, response) => {
    try {
        const posts = await Posts.findAll();
        response.json(posts);
    } catch (error) {
        response.status(500).json(error);
    }
});

route.get("/posts/:id", async (request, response) => {
    try {
        const post = await Posts.findOne({
            where: {
                id: request.params.id
            }
        });
        if (!post) {
            throw "Post not found";
        }
        response.json(post);
    } catch (error) {
        response.status(500).json(error);
    }
});

const schema = Joi.object({
    id: Joi.number().integer().min(1),
    text: Joi.string().min(3).max(255),
    userId: Joi.number().integer().min(1),
    groupId: Joi.number().integer().min(1).empty("").default(null),
    parentId: Joi.number().integer().min(1).empty("").default(null)
});

route.post("/posts", async (request, response) => {
    try {
        const { error, value } = schema.validate(request.body);
        if (error) {
            throw(error);
        }
        const post = await Posts.create(value);
        response.json(post);
    } catch (error) {
        response.status(500).json(error);
    }
});

route.put("/posts", async (request, response) => {
    try {
        const { error, value } = schema.validate(request.body);
        if (error) {
            throw(error);
        }
        if (!value.id) {
            throw "No post id provided";
        }
        const post = await Posts.findOne({
            where: {
                id: value.id
            }
        });
        if (!post) {
            throw "Post not found";
        }
        await post.update(value);
        response.status(200).send();
    } catch (error) {
        response.status(500).json(error);
    }
});

route.delete("/posts", async (request, response) => {
    try {
        const { error, value } = schema.validate(request.body);
        if (error) {
            throw(error);
        }
        if (!value.id) {
            throw "No post id provided";
        }
        const post = await Posts.findOne({
            where: {
                id: value.id
            }
        });
        if (!post) {
            throw "Post not found";
        }
        await post.destroy();
        response.status(200).send();
    } catch (error) {
        response.status(500).json(error);
    }
});

module.exports = route;