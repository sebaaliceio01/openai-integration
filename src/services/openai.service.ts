import { CreateChatCompletionRequest, CreateCompletionRequest, CreateCompletionResponse, CreateEditRequest, OpenAIApi } from "openai";
import { HttpService } from "./http.service";
import { config } from "@/config";

export class OpenaiService {
  public openai: OpenAIApi

  private httpService: HttpService

  constructor(configuration: any) {
    this.openai = this.initOpenai(configuration)
    this.httpService = new HttpService('https://api.openai.com/v1')
  }

  private initOpenai(configuration: any) {
    return new OpenAIApi(configuration)
  }

  async listOfModels(): Promise<any> {
    const getResponse = await this.openai.listModels();

    return getResponse.data;
  }

  async getModel(modelId: string): Promise<any> {
    try {
      const getResponse = await this.openai.retrieveModel(modelId);

      return getResponse.data;
    } catch (err) {
      return err
    }
  }

  async createCompletion(data: CreateCompletionRequest): Promise<CreateCompletionResponse | Error> {
    try {
      const getResponse = await this.httpService.post('/completions', data, this.getHeaders())

      return getResponse as CreateCompletionResponse
    } catch (error) {
      return error as Error
    }
  }

  async createChatCompletion(data: CreateChatCompletionRequest) {
    try {
      const getResponse = await this.httpService.post('/chat/completions', data, this.getHeaders())

      return getResponse
    } catch (error) {
      return error
    }
  }

  async createEdit(data: CreateEditRequest) {
    try {
      const getResponse = await this.httpService.post('/edits', data, this.getHeaders())

      return getResponse
    } catch (error) {
      return error
    }
  }

  private getHeaders(): any {
    return {
      headers: {
        Authorization: `Bearer ${config.openai.key}`,
        'Content-Type': 'application/json',
      },
    };
  }
}

export default OpenaiService