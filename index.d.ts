import { ReactElement } from 'react';

// Type definitions for ReactLogistics

// tslint:disable-next-line:export-just-namespace
export = ReactLogistics;
export as namespace ReactLogistics;

declare namespace ReactLogistics {
  type ReactLogisticsOption = {
    exposeGlobal?: boolean;
    saveHistory?: boolean;
  };

  function buildStore<T>(
    initialVal: T,
    key: string,
    option?: ReactLogisticsOption,
  ): {
    Provider: React.ComponentClass<{}, T>;
    withConsumer: <IState>(
      WrappedComponent: React.ComponentType<IState>,
    ) => (props: any) => JSX.Element;
    getState: () => T;
    setState: (newState: Partial<T>) => void;
  };
}
