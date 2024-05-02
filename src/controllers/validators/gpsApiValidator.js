import Joi from "joi";

const createNewGpsValidator = Joi.object({
    gps_name: Joi.string()
        .required()
        .messages({
            'any.required': 'gps_name field is required!'
    }),
    protocol: Joi.string()
        .messages({
            'any.required': 'protocol field is required!'
        }),
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
    backup_imei: Joi.string()
        .min(15)
        .max(15)
        .messages({
            'any': 'backup_imei invalid!'
        }),
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