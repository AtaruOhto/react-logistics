import { ReactElement } from 'react';

export interface ReactLogisticsOption {
  debug?: {
    beforeUpdate?: boolean;
    afterUpdate?: boolean;
    payload?: boolean;
    global?: boolean;
  };
}

export declare function buildStore<T>(
  initialVal: T,
  key: string,
  option?: ReactLogisticsOption,
): {
  Provider: React.ComponentClass<{}, T>;
  withConsumer: <IState>(
    WrappedComponent: React.ComponentType<IState>,
  ) => (props: any) => JSX.Element;
  getState: T;
  setState: (newState: Partial<T>) => void;
};
