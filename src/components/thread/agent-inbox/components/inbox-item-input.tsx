import { HumanResponseWithEdits, SubmitType } from "../types";
import React from "react";
import { HumanInterrupt } from "@langchain/langgraph/prebuilt";
import { SwapPoolSelection } from "./SwapPoolSelection";
import { TransferInterruptInput } from "./TransferInterruptInput";

interface InboxItemInputProps {
  interruptValue: HumanInterrupt;
  humanResponse: HumanResponseWithEdits[];
  supportsMultipleMethods: boolean;
  acceptAllowed: boolean;
  hasEdited: boolean;
  hasAddedResponse: boolean;
  initialValues: Record<string, string>;

  streaming: boolean;
  streamFinished: boolean;

  setHumanResponse: React.Dispatch<
    React.SetStateAction<HumanResponseWithEdits[]>
  >;
  setSelectedSubmitType: React.Dispatch<
    React.SetStateAction<SubmitType | undefined>
  >;
  setHasAddedResponse: React.Dispatch<React.SetStateAction<boolean>>;
  setHasEdited: React.Dispatch<React.SetStateAction<boolean>>;

  handleSubmit: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent> | React.KeyboardEvent,
  ) => Promise<void>;
}

export function InboxItemInput(props: InboxItemInputProps) {
  const { interruptValue } = props;

  // Check if this is a swap pool selection
  const isSelectPool =
    interruptValue?.action_request?.action === "Select Pool" &&
    Array.isArray(interruptValue?.action_request?.args?.pools);

  // Check if this is a transfer confirmation
  const isTransferConfirmation = 
    interruptValue?.action_request?.action === "Transfer Confirmation";

  // Render appropriate component based on interrupt type
  if (isSelectPool) {
    return (
      <SwapPoolSelection
        interruptValue={interruptValue}
        streaming={props.streaming}
      />
    );
  }

  if (isTransferConfirmation) {
    return <TransferInterruptInput {...props} />;
  }

  // Default: render transfer interrupt input for other cases
  return <TransferInterruptInput {...props} />;
}
