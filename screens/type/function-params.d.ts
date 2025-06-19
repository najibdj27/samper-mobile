export type ShowDialogConfirmationParamsType = {
  icon: string;
  title: string;
  text: string;
  positiveFunc: () => void;
  negativeFunc?: () => void | null;
};