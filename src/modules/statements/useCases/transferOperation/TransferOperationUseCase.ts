import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { OperationType } from "@modules/statements/entities/Statement";
import { IStatementsRepository } from "@modules/statements/repositories/IStatementsRepository";
import { ITransferOperationDTO } from "./ITransferOperationDTO";
import { TransferOperationError } from "./TransferOperationError";


@injectable()
class TransferOperationUseCase {

    constructor(
        @inject("UsersRepository")
        private usersRepository: IUsersRepository,

        @inject("StatementsRepository")
        private statementsRepository: IStatementsRepository,
    ) {}

    async execute({
        receiver_id,
        sender_id,
        description,
        amount
    }: ITransferOperationDTO) {
        const senderExists = await this.usersRepository.findById(sender_id);

        if(!senderExists) {
            throw new TransferOperationError.SenderNotFound();
        }

        const receiverExists = await this.usersRepository.findById(receiver_id);

        if(!receiverExists) {
            throw new TransferOperationError.ReceiverNotFound();
        }

        const senderBalance = await this.statementsRepository.getUserBalance({
            user_id: sender_id
        });

        if(amount > senderBalance.balance) {
            throw new TransferOperationError.InsufficientFunds();
        }

        await this.statementsRepository.create({
            user_id: sender_id,
            type: OperationType.WITHDRAW,
            amount,
            description: `Transfer to ${receiverExists.name}: ${description}`
        });

        const transferOperation = await this.statementsRepository.create({
            sender_id: sender_id,
            user_id: receiver_id,
            description,
            amount,
            type: OperationType.TRANSFER
        });

        return transferOperation;
    }
}

export { TransferOperationUseCase };