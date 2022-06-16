type AppState = {
  loading: boolean
};

type AppAction = {
  type: string
};

type DispatchType = (args: AppAction) => AppAction;
