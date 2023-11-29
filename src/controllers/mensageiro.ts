import { Controller, Get } from "@overnightjs/core";
import { Request, Response } from "express"

@Controller('message')
export class MessageController {

    @Get('')
    public messageToLoggedUser(_: Request, res: Response): void {
        res.send("Funcional")
    }
}