import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import _isObject from "lodash/isObject";

import CatalogProduct from "../../ProductUnit/CatalogProduct";
import Skeleton from "../../common/Skeleton";
import Accordion from "../../common/Accordion";

import { _getArr } from "../../../helpers/utils";
import {
  getProductCategories,
  getProducts,
} from "../../../pages/Catalog/thunk/catalogThunk";
import Pagination from "../../common/Pagination";
import EmptyData from "../../common/EmptyData";
import { setSelectedCategory } from "../../../pages/Catalog/slice/catalogSlice";

function ProductList({ filterValue }) {
  const dispatch = useDispatch();

  const {
    productCategories: { data: categories, category_slug: selectedCategory },
    products: {
      sortConfig,
      data: products,
      pagination: paginationConfig,
      loading: productsLoading,
    },
  } = useSelector((state) => state.catalogSlice);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts({ page: 1, query: filterValue });
  }, [sortConfig]);

  function fetchCategories() {
    dispatch(getProductCategories());
  }

  function fetchProducts({ page = 1, query }) {
    dispatch(
      getProducts({
        category_slug: selectedCategory == "all" ? "" : selectedCategory,
        page,
        query,
        ...sortConfig,
      })
    );
  }

  

  

  const gotoPage = (pageNum) => {
    fetchProducts({
      page: pageNum,
      query: filterValue,
    });
  };

  return (
    <>
      <div className="flex center">
        <span className="ml-30 text-xs font-semibold">
          {products?.length} products
        </span>
      </div>
      <div className="mt-5 flex">
        <div className="mr-10">
          <CatalogFilters {...{ categories }} />
        </div>
        <div className="flex flex-wrap gap-[13px]">
          {productsLoading ? (
            <>
              {_getArr(12).map(() => (
                <Skeleton width={"w-64"} height="h-60" />
              ))}
            </>
          ) : (
            <>
              {!products.length ? (
                <EmptyData align="items-start" msg="No Products Found!" />
              ) : (
                products.map((product, index) => (
                  <CatalogProduct key={index} {...{ product }} />
                ))
              )}
              <div className="w-full mt-4">
                {paginationConfig.total_pages > 1 && (
                  <Pagination
                    compact
                    gotoPage={(pageNum) => gotoPage(pageNum)}
                    disabled={paginationConfig.total_pages === 1}
                    className="float-right shadow-lg"
                    config={paginationConfig}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductList;

const CatalogFilters = ({ categories }) => {
  const dispatch = useDispatch();

  const {
    productCategories: { category_slug: selectedCategory },
  } = useSelector((state) => state.catalogSlice);

  const _setSelectedCategory = (slug) => dispatch(setSelectedCategory(slug));

  return (
    <div>
      <Accordion
        compact
        showPlusIcon
        className={"p-2 bg-base-100 collapse-open rounded-lg !w-56 text-xs"}
        itemClassName="!-mb-0.5"
        data={[
          {
            title: "Categories",
            content: (
              <ul className="menu rounded-lg text-xs font-semibold transition-all duration-300">
                <li onClick={() => _setSelectedCategory("all")}>
                  <a
                    className={`rounded-lg ${
                      selectedCategory == "all" ? "active dark:text-accent" : ""
                    }`}
                  >
                    All
                  </a>
                </li>
                {categories?.map((category) => (
                  <li onClick={() => _setSelectedCategory(category.slug)}>
                    <a
                      className={`rounded-lg ${
                        selectedCategory === category.slug
                          ? "active dark:text-accent"
                          : ""
                      }`}
                    >
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            ),
          },
        ]}
      />
    </div>
  );
};
