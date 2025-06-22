import { IsString, IsUUID, IsObject, MaxLength, IsJSON, IsOptional } from "class-validator";

export class CreateMenuDto {
    /**
    * The name of the menu
    * @example "Lunch Menu"
    */
    @IsString()
    @IsOptional()
    @MaxLength(255)
    name?: string;

    /**
    * The menu schema (structure of sections and items)
    * @example {
    *   "header": [
    *     {
    *       "version": "v1",
    *       "type": "heading",
    *       "heading": "Welcome to Our Restaurant"
    *     }
    *   ],
    *   "menu": [
    *     {
    *       "version": "v1",
    *       "type": "menu-group",
    *       "name": "Breakfast Menu",
    *       "timeFrom": "07:00",
    *       "timeTo": "12:00",
    *       "items": [
    *         {
    *           "version": "v1",
    *           "id": "item-1750548838190",
    *           "name": "Classic Pancakes",
    *           "description": "Fluffy pancakes served with maple syrup and butter",
    *           "price": {
    *             "amount": 12.99,
    *             "currency": "USD"
    *           },
    *           "ingredients": ["flour", "eggs", "milk", "butter"],
    *           "categories": ["breakfast", "sweet"],
    *           "image": [
    *             {
    *               "url": {
    *                 "url": "https://example.com/pancakes.jpg",
    *                 "downloadUrl": "https://example.com/pancakes.jpg?download=1",
    *                 "pathname": "pancakes.jpg",
    *                 "contentType": "image/jpeg",
    *                 "contentDisposition": "inline; filename=\"pancakes.jpg\""
    *               }
    *             }
    *           ]
    *         }
    *       ]
    *     }
    *   ]
    * }
    */
    @IsJSON()
    schema: Record<string, any>;
}