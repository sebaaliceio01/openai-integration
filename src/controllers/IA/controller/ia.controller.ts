import { Configuration, CreateCompletionResponse } from "openai";
import { Controller, Get, Post, Request, Response } from "@decorators/express";

import OpenaiService from "@/services/openai.service";
import { config } from "@/config";
// import AuthGuard from "@/middlewares/checkAuthentication.middeware";

const configuration = new Configuration({
  organization: config.openai.org,
  apiKey: config.openai.key,
});

@Controller('/ia')
class IAController {

  constructor(
    private openaiService: OpenaiService,
  ) {
    this.openaiService = new OpenaiService(configuration)
  }

  @Post('/chat')
  async createChatcompletion(@Request() req: any, @Response() res: any): Promise<void> {
    try {
      const response = await this.openaiService.createChatCompletion(req.body)

      res.status(200).send({
        data: response
      })
    } catch (error: any) {
      res.status(500).send({ error: error.message })
    }
  }

  @Post('/create-edit')
  async createEdit(@Request() req: any, @Response() res: any): Promise<void> {
    try {
      const response = await this.openaiService.createEdit(req.body)

      res.status(200).send({
        data: response
      })
    } catch (error: any) {
      res.status(500).send({ error: error.message })
    }
  }

  @Post('/create-completion')
  async createCompletion(@Request() req: any, @Response() res: any): Promise<void> {
    try {
      const response = await this.openaiService.createCompletion(req.body)

      res.status(200).send({
        data: response
      })
    } catch (error: any) {
      res.status(500).send({ error: error.message })
    }
  }

  @Post('/create-recipe')
  async createRecipe(@Request() req: any, @Response() res: any): Promise<void> {

    const body = {
      "model": req.body.model,
      "prompt": JSON.stringify({
        "instruccion": "Crear una posible receta con los ingredientes que te voy a mandar a continuacion en la lista 'Ingredientes', ten en cuenta que la lista ingredientes es un array de objetos con el nombre del ingrediente y tambien la cantidad que disponemos. Deberiamos poder analizar que recetas podemos crear en base a todos los items que te envio",
        "Ingredientes": req.body.items
      }),
      "max_tokens": 500,
      "temperature": 1,
    }

    try {
      const response: CreateCompletionResponse | any = await this.openaiService.createCompletion(body as any)

      res.status(200).send({
        data: response.choices[0].text
      })
    } catch (error: any) {
      res.status(500).send({ error: error.message })
    }
  }

  @Get('/models')
  async getModels(@Response() res: any): Promise<void> {
    try {
      const response = await this.openaiService.listOfModels()

      res.status(200).send({ data: response })
    } catch (err: any) {
      res.status(500).send({ error: err.message })
    }
  }
}


export default IAController