import Joi from "joi";

const createNewGpsValidator = Joi.object({
    imei: Joi.string()
        .min(15)
        .max(15)
        .required()
        .messages({
            'any.required': 'Imei field is required!'
        }),
    device_id : Joi.string()
        .required()
        .messages({
            'any.required': 'Device field is required!'
        }),
    alternate_imei : Joi.string()
        .min(15)
        .max(15)
})

const createNewCommandValidator = Joi.object({
    command_name: Joi.string()
        .min(1)
        .max(250)
        .required()
        .messages({
            'any.required': 'Command name field is required!'
        }),
    command_hex : Joi.string()
        .required()
        .messages({
            'any.required': 'Command hex field is required!'
        }),
    device_id : Joi.string()
        .required()
        .messages({
            'any.required': 'Device id is required!'
        })
})

const sendCommandValidator = Joi.object({
    imei: Joi.string()
        .min(15)
        .max(15)
        .required()
        .messages({
            'any.required': 'Command name field is required!'
        }),
    command : Joi.string()
        .required()
        .messages({
            'any.required': 'Command hex field is required!'
        })
})

export { createNewGpsValidator, createNewCommandValidator, sendCommandValidator }