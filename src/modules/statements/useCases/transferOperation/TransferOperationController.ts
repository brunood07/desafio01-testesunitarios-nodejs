import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferOperationUseCase } from "./TransferOperationUseCase";

class TransferOperationController {

    async handle(request: Request, response: Response): Promise<Response> {
        const { amount, description } = request.body;
        const { id: sender_id } = request.user;
        const { receiver_id } = request.params;

        const transferOperationUseCase = container.resolve(TransferOperationUseCase);
        const transfer = await transferOperationUseCase.execute({
            sender_id,
            receiver_id,
            description,
            amount
        });

        return response.status(201).json(transfer);
    }
}

export { TransferOperationController };