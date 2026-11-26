import type { IPageBuildOptions } from './page-build.options';
import type { IPageWindowClampOptions } from './page-window-clamp.options';
import type { IPageWindow } from './page-window.interface';
import type { IPage } from './page.interface';

export class PaginationHelper {
  public static readonly MAX_PAGE = 1000;
  public static readonly MAX_LIMIT = 100;

  public static clampPageWindow(options: IPageWindowClampOptions): IPageWindow {
    const { query, limits = {} } = options;
    const { page: queryPage, limit: queryLimit } = query;
    const {
      defaultPage = 1,
      defaultLimit = 20,
      maxLimit = PaginationHelper.MAX_LIMIT,
      maxPage = PaginationHelper.MAX_PAGE,
    } = limits;
    const flooredPage = Math.floor(queryPage ?? 0);
    const flooredLimit = Math.floor(queryLimit ?? 0);
    const page = flooredPage > 0 ? Math.min(flooredPage, maxPage) : defaultPage;
    const limit = flooredLimit > 0 ? Math.min(flooredLimit, maxLimit) : defaultLimit;
    const offset = (page - 1) * limit;

    return { page, limit, offset };
  }

  public static toPage<T>(options: IPageBuildOptions<T>): IPage<T> {
    const { data, page, limit, total } = options;
    const count = data.length;
    const pageCount = Math.ceil(total / limit);

    return { page, limit, count, pageCount, total, data };
  }
}
