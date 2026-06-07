import React from "react";
import { View } from "react-native";
import { EmptyState } from "./EmptyState";

type Props = {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
};

type State = {
  hasError: boolean;
  error: Error | null;
  resetKey: number;
};

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null, resetKey: 0 };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  reset = () => {
    this.setState((s) => ({
      hasError: false,
      error: null,
      resetKey: s.resetKey + 1,
    }));
  };

  render() {
    if (this.state.hasError) {
      const { title = "Something went wrong", subtitle } = this.props;
      const message =
        subtitle ??
        this.state.error?.message ??
        "An unexpected error occurred. Please try again.";

      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <EmptyState
            icon="⚠️"
            title={title}
            subtitle={message}
            actionLabel="Try again"
            onAction={this.reset}
          />
        </View>
      );
    }

    return (
      <React.Fragment key={this.state.resetKey}>
        {this.props.children}
      </React.Fragment>
    );
  }
}
