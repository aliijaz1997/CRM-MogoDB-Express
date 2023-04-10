import { GridSortModel } from "@mui/x-data-grid";

export const getSortParams = (sortModel: GridSortModel) => {
  if (sortModel.length > 0) {
    const sortParam = sortModel.map((item) => {
      return `${item.field}:${item.sort}`;
    });
    return sortParam.join(",");
  }
  return null;
};
