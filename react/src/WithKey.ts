import React from "react";
import { CurrentKeyContext } from "./constants";

type GetProps<T> = T extends (props: infer Props) => JSX.Element
  ? Props
  : unknown;

export function WithKey<Props, Component extends (props: Props) => JSX.Element>(
  component: Component,
  obj?: {
    genKey?: (props: GetProps<Component>) => any;
    onUpdate?: (props: GetProps<Component>, key: any) => void;
    onMount?: (props: GetProps<Component>, key: any) => void;
    name?: string;
  }
): Component;

export function WithKey(component, options) {
  options ||= {};

  class Parent extends React.Component {
    key: any = void 0;

    componentWillMount(): void {
      if (options.genKey) {
        this.key = options.genKey(this.props);
      } else {
        this.key = { nodes: new Set(), name: options.name || void 0 };
      }
      if (options.onMount) {
        options.onMount(this.props, this.key);
      }
    }

    componentWillUnmount(): void {
      const { key } = this;
      if (key && key.nodes instanceof Set) {
        for (const node of key.nodes) {
          node.garbageCollect(key);
        }
      }
    }

    render() {
      if (options.onUpdate) {
        options.onUpdate(this.props, this.key);
      }

      const Child: any = component;
      return React.createElement(
        CurrentKeyContext.Provider,
        { value: this.key },
        React.createElement(Child, this.props, null)
      );
    }
  }
  return Parent as any;
}
