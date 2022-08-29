import { RequestFactory } from "../../Requestors/RequestFactory";
import { InteractorFactory } from "../../Requestors/InteractorFactory";
import { UseCaseRequest } from "../../Requestors/UseCaseRequest";
import { UseCaseFactories } from "./UseCaseFactories";

export class Controller {
  private url: string;
  private method: string;
  private successCode: number;
  private useCaseName: string;
  private requestFactory: RequestFactory;
  private interactorFactory: InteractorFactory;
  private beforeCommandMiddlewares?: any[];

  public static get STRATEGIES() {
    return {
      CREATE: {
        method: "post",
        successCode: 201,
      },
      GET: {
        method: "get",
        successCode: 200,
      },
      SEND: {
        method: "post",
        successCode: 201,
      },
    };
  }

  constructor(opts: {
    url: string;
    strategy: { method: string; successCode: number };
    useCaseName: string;
    beforeCommandMiddlewares?: any[];
  }) {
    this.url = opts.url;
    this.method = opts.strategy.method;
    this.successCode = opts.strategy.successCode;
    this.requestFactory = UseCaseFactories.getRequestFactories();
    this.interactorFactory = UseCaseFactories.getInteractorFactories();
    this.useCaseName = opts.useCaseName;
    this.beforeCommandMiddlewares = opts.beforeCommandMiddlewares || [];
  }

  public addToRouter(route) {
    const middlewares = [
      ...this.beforeCommandMiddlewares,
      this.buildCommandMiddleware(),
    ];

    route[this.method](this.url, ...middlewares);
  }

  public static addControllerToRoutes(controller: Controller, route) {}

  private buildCommandMiddleware() {
    return async (req, res) => {
      res.setHeader("Content-Type", "application/json");

      let useCaseRequest: UseCaseRequest;
      try {
        useCaseRequest = await this.requestFactory.make(this.useCaseName, req);
      } catch (err) {
        return renderRequestorError(res, err);
      }

      try {
        const interactor = this.interactorFactory.make(this.useCaseName);
        const result = await interactor.execute(useCaseRequest);
        res.status(this.successCode);
        return res.end(JSON.stringify(result, null, 2));
      } catch (err) {
        return renderInteractorError(res, err);
      }
    };

    function renderInteractorError(res, err) {
      if (err.name === "NotFoundError") {
        return res.status(404).end(strignifyError(err));
      } else {
        return res.status(500).end(strignifyError(err));
      }
    }

    function renderRequestorError(res, err) {
      if (err.name === "ValidationError") {
        return res.status(400).end(strignifyError(err));
      } else {
        return res.status(500).end(strignifyError(err));
      }
    }

    // services functions
    function strignifyError(error) {
      return JSON.stringify(
        { name: error.name, message: error.message },
        null,
        2
      );
    }
  }
}
