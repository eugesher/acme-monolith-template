interface IPageWindowClampQuery {
  page?: number;
  limit?: number;
}

interface IPageWindowClampLimits {
  defaultPage?: number;
  defaultLimit?: number;
  maxLimit?: number;
  maxPage?: number;
}

export interface IPageWindowClampOptions {
  query: IPageWindowClampQuery;
  limits?: IPageWindowClampLimits;
}
