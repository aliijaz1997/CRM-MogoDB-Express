import { GridFilterModel } from "@mui/x-data-grid";

export const getFilterParams = (filterModel: GridFilterModel) => {
  const filters = filterModel && filterModel.items;

  if (filters) {
    const params: { [key: string]: string } = {};
    filters.forEach((item) => {
      const fieldName = item.field;
      const value = item.value;

      if (value !== null && value !== undefined) {
        if (item.operator === "contains") {
          params[`${fieldName}_contains`] = value;
        } else if (item.operator === "equals" || item.operator === "=") {
          params[`${fieldName}_equals`] = value;
        } else if (item.operator === "startsWith") {
          params[`${fieldName}_startsWith`] = value;
        } else if (item.operator === "endsWith") {
          params[`${fieldName}_endsWith`] = value;
        } else if (item.operator === "isEmpty") {
          params[`${fieldName}_isEmpty`] = value;
        } else if (item.operator === "isNotEmpty") {
          params[`${fieldName}_isNotEmpty`] = value;
        } else if (item.operator === "isAnyOf") {
          params[`${fieldName}_isAnyOf`] = value;
        } else if (item.operator === ">") {
          params[`${fieldName}_greaterThan`] = value;
        } else if (item.operator === ">=") {
          params[`${fieldName}_greaterThanOrEqual`] = value;
        } else if (item.operator === "<") {
          params[`${fieldName}_lessThan`] = value;
        } else if (item.operator === "<=") {
          params[`${fieldName}_lessThanOrEqual`] = value;
        }
      }
    });

    const paramString = Object.keys(params)
      .map(
        (key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`
      )
      .join("&");
    return paramString;
  }

  return null;
};
