const express = require("express");
const { Follows } = require("../models");
const Joi = require("joi");
require("dotenv").config();

const route = express.Router();
route.use(express.json());
route.use(express.urlencoded({ extended: true }));

route.get("/follows", async (request, response) => {
    try {
        const follows = await Follows.findAll();
        response.json(follows);
    } catch (error) {
        response.status(500).json(error);
    }
});

const schema = Joi.object({
    followerId: Joi.number().integer().min(1).required(),
    followedId: Joi.number().integer().min(1).required()
});

route.post("/follows", async (request, response) => {
    try {
        const { error, value } = schema.validate(request.body);
        if (error) {
            throw(error);
        }
        const following = await Follows.create(value);
        response.json(following);
    } catch (error) {
        response.status(500).json(error);
    }
});

route.delete("/follows", async (request, response) => {
    try {
        const { error, value } = schema.validate(request.body);
        if (error) {
            throw(error);
        }
        const follow = await Follows.findOne({
            where: value
        });
        if (!follow) {
            throw "Follow not found";
        }
        await follow.destroy();
        response.status(200).send();
    } catch (error) {
        response.status(500).json(error);
    }
});

module.exports = route;