import * as React from 'react';

export function getWithConsumer<T>(context: React.Context<T>) {
  return <OuterProps extends {}>(
    WrappedComponent: React.ComponentType<OuterProps>,
  ) => (props: any) => (
    <context.Consumer>
      {context => <WrappedComponent {...props} {...context} />}
    </context.Consumer>
  );
}
