"use strict";

import { RequestFactory } from "../../Requestors/RequestFactory";
import { InteractorFactory } from "../../Requestors/InteractorFactory";

export class UseCaseFactories {
  private static requestFactories: RequestFactory;
  private static interactorFactories: InteractorFactory;

  public static initFactories(factories: {
    requestFactories: RequestFactory;
    interactorFactories: InteractorFactory;
  }) {
    UseCaseFactories.requestFactories = factories.requestFactories;
    UseCaseFactories.interactorFactories = factories.interactorFactories;
  }

  public static getRequestFactories(): RequestFactory {
    return this.requestFactories;
  }

  public static getInteractorFactories(): InteractorFactory {
    return this.interactorFactories;
  }
}
