import React, { useState } from "react";
import { PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";

import CommonForm from "./../../components/common/CommonForm";
import Text from "../../components/common/Typography/Text";
import Table from "../../components/common/neomorphic/Table";

import { _calculatePercentage, _isEmpty } from "../../helpers/utils";

export default function CreateNewQuotationForm({
  data: selectedService,
  selectedServicePartners,
  formData,
  setFormData,
  mode = "READ_ONLY",
  data={}
}) {
  const [editingItemFlag, setEditingItemFlag] = useState({ flag: false });
  const [newItem, setNewItem] = useState({
    work_Description: "",
    qty: "",
    unit: "",
    rate: "",
    amount: "",
    partner_Rate: "",
    item_Type: "",
  });

  const handleItemFieldChange = (e) => {
    setNewItem({
      ...newItem,
      ...e,
    });
  };

  const addOrEditItem = () => {
    const amount = newItem.qty * newItem.rate;
    let items = [];
    // if item is being edited, omit it from itemsArray
    if (editingItemFlag.flag) {
      const indexToInsert = editingItemFlag.editItemIndex - 1;
      // splicing the element without mutating formData
      items = [...formData.items];
      items.splice(indexToInsert, 1, {
        ...newItem,
        amount,
      });
      setEditingItemFlag({ flag: false });
    } else {
      items = [...formData.items, { ...newItem, amount }];
    }

    const subTotal = items.reduce((sum, item) => sum + item.amount, 0);
    const mgmtFeeAmt = 0;
    //  formData.mgmtFeeApplicable
    //   ? _calculatePercentage(subTotal, formData.managementFeePercent)
    //   : 0;
    const discountAmt = formData.discountApplicable
      ? _calculatePercentage(
          Number(subTotal) + Number(mgmtFeeAmt),
          formData.discountPercent
        )
      : 0;
    const taxAmt = _calculatePercentage(
      Number(subTotal) + Number(mgmtFeeAmt) - Number(discountAmt),
      formData.taxPercent
    );

    const totalAmount = (
      Number(subTotal) +
      Number(mgmtFeeAmt) -
      Number(discountAmt) +
      Number(taxAmt)
    ).toFixed(2);
    console.log('handleItemFieldChange', items)
    setFormData({
      ...formData,
      items,
      actualAmount: subTotal,
      // otherCharges: mgmtFeeAmt,
      discount: discountAmt,
      tax: taxAmt,
      totalAmount: totalAmount,
    });

    setNewItem({
      work_Description: "",
      qty: "",
      rate: "",
      unit: "",
      amount: "",
      isContractual:false,
      partner_Rate: "",
      item_type: "",
    });
  };
  const settings = data?.society?.settings || {}
  console.log("settings Quotation form", settings)
  const optionalFields = []
  const isContractualRateOption =settings?.["IS_CONTRACTUAL_VS_NON_CONTRACTUAL_RATE_OPTION"]
  if(isContractualRateOption){
    optionalFields.push({
      label: "Is Contracutal Rate",
      name: "isContractual",
      type: "BOOLEAN",
      value: newItem?.isContractual,
      setData: (obj) => handleItemFieldChange(obj),
    })
  }
  const excludeColumns = ['serialNumber']
  if(!isContractualRateOption){
    excludeColumns.push('isContractual')
  }
  return (
    <div className={`grid gap-2 mb-4`}>
      {mode === "EDIT" && (
        <Text className="pt-2 text-lg font-semibold text-center">
          Quotation Details
        </Text>
      )}
      {mode === "EDIT" && (
        <div className="form-container">
          <CommonForm
            {...{
              submitText: `${
                editingItemFlag.flag ? "Update Item" : "Add Item"
              }`,
              onSubmit: addOrEditItem,
              formData: [
                {
                  label: "Note",
                  name: "note",
                  value: formData?.note || "",
                  type: "TEXTAREA",
                  setData: (obj) => setFormData({ ...formData, ...obj }),
                },
                {
                  label: "Vendor",
                  name: "partner",
                  native: false,
                  value: formData?.partner || "",
                  options: selectedServicePartners,
                  type: "SELECT",
                  setData: (obj) => setFormData({ ...formData, ...obj }),
                },
                {
                  label: "Calculation Details",
                  type: "SEPERATOR",
                },
                {
                  label: "Discount",
                  name: "discountApplicable",
                  type: "BOOLEAN",
                  value: formData?.discountApplicable || false,
                  setData: (obj) => setFormData({ ...formData, ...obj }),
                },
                {
                  label: "Management Fee",
                  name: "mgmtFeeApplicable",
                  type: "BOOLEAN",
                  value: formData?.mgmtFeeApplicable || false,
                  setData: (obj) => setFormData({ ...formData, ...obj }),
                },
                {
                  label: "Discount (%)",
                  name: "discountPercent",
                  type: "NUMBER",
                  hide: Boolean(!formData?.discountApplicable),
                  required: Boolean(formData?.discountApplicable),
                  value: Boolean(formData?.discountApplicable)
                    ? formData?.discountPercent
                    : 0,
                  setData: (obj) => setFormData({ ...formData, ...obj }),
                },
                {
                  label: "Managament Fee (%)",
                  name: "managementFeePercent",
                  type: "NUMBER",
                  hide: Boolean(!formData?.mgmtFeeApplicable),
                  required: Boolean(formData?.mgmtFeeApplicable),
                  value: Boolean(formData?.mgmtFeeApplicable)
                    ? formData?.managementFeePercent
                    : 0,
                  setData: (obj) => setFormData({ ...formData, ...obj }),
                },
                {
                  label: "Tax (%)",
                  name: "taxPercent",
                  type: "NUMBER",
                  required: true,
                  value: formData?.taxPercent || "",
                  setData: (obj) => setFormData({ ...formData, ...obj }),
                },
                {
                  label: "Item Details",
                  type: "SEPERATOR",
                },
                {
                  label: "Item Type",
                  leftLabel: "Material",
                  rightLabel: "Labour",
                  name: "item_Type",
                  type: "SWITCH",
                  value: newItem?.item_Type || false,
                  setData: (obj) => handleItemFieldChange(obj),
                },
                {
                  label: `Vendor ${
                    newItem?.item_Type ? "Labour" : "Material"
                  } Rate`,
                  name: "partner_Rate",
                  type: "NUMBER",
                  value: newItem?.partner_Rate,
                  setData: (obj) => handleItemFieldChange(obj),
                },
                {
                  label: "Work Description",
                  name: "work_Description",
                  type: "TEXTAREA",
                  required: true,
                  value: newItem?.work_Description || "",
                  setData: (obj) => handleItemFieldChange(obj),
                },
                {
                  label: "Quantity",
                  name: "qty",
                  type: "NUMBER",
                  required: true,
                  value: newItem?.qty || "",
                  setData: (obj) => handleItemFieldChange(obj),
                },
                {
                  label: "Unit",
                  name: "unit",
                  native: true,
                  type: "SELECT",
                  options: [
                    {
                      label: "Select",
                      value: "",
                    },
                    {
                      label: "Nos",
                      value: "Nos",
                    },
                    {
                      label: "Kg",
                      value: "Kg",
                    },
                    {
                      label: "Ltr",
                      value: "Ltr",
                    },
                    {
                      label: "Mtr",
                      value: "Mtr",
                    },
                  ],
                  required: true,
                  value: newItem?.unit || "",
                  setData: (obj) => handleItemFieldChange(obj),
                },
                {
                  label: "Rate (₹)",
                  name: "rate",
                  type: "NUMBER",
                  required: true,
                  value: newItem?.rate || "",
                  setData: (obj) => handleItemFieldChange(obj),
                },
                ...optionalFields
              ],
              btnClasses: "text-center",
            }}
          />
          {!_isEmpty(formData.items) && (
            <>
              <Text className="text-lg font-semibold underline">
                Items Details
              </Text>
              <Table
                data={formData.items.map(
                  ({ serialNumber, ...item }, index) => ({
                    sr_No: index + 1,
                    ...item,
                    isContractual:item?.isContractual?'Yes':'No',
                    item_Type: Boolean(item.item_Type) ? "Labour" : "Material",
                    actions: (
                      <div className="flex items-center gap-2">
                        <PencilSquareIcon
                          onClick={() => {
                            setEditingItemFlag({
                              flag: true,
                              editItemIndex: index + 1,
                            });
                            console.log('==item',item)
                            setNewItem({ ...item});
                          }}
                          className="w-6 h-6 p-1 text-white duration-300 rounded bg-accent hover:bg-opacity-50"
                        />
                        <TrashIcon
                          onClick={() => {
                            // Remove the item from the items array
                            const updatedItems = formData.items.filter(
                              (item, itemIndex) => itemIndex !== index
                            );

                            // Recalculate the subtotal
                            const subTotal = updatedItems.reduce(
                              (sum, item) => sum + item.amount,
                              0
                            );

                            // Calculate the new values for discount, tax, and totalAmount
                            const mgmtFeeAmt = 0;
                            const discountAmt = formData.discountApplicable
                              ? _calculatePercentage(
                                  Number(subTotal) + Number(mgmtFeeAmt),
                                  formData.discountPercent
                                )
                              : 0;
                            const taxAmt = _calculatePercentage(
                              Number(subTotal) +
                                Number(mgmtFeeAmt) -
                                Number(discountAmt),
                              formData.taxPercent
                            );
                            const totalAmount = (
                              Number(subTotal) +
                              Number(mgmtFeeAmt) -
                              Number(discountAmt) +
                              Number(taxAmt)
                            ).toFixed(2);

                            // Update formData with the new values
                            setFormData({
                              ...formData,
                              items: updatedItems,
                              actualAmount: subTotal,
                              discount: discountAmt,
                              tax: taxAmt,
                              totalAmount: totalAmount,
                            });
                          }}
                          className="w-6 h-6 p-1 text-white duration-300 rounded bg-error hover:bg-opacity-50"
                        />
                      </div>
                    ),
                  })
                )}
                wrapperClass="mt-4"
                columns={[
                  "sr_No",
                  ...Object.keys(formData.items[0]).filter(
                    (key) => !excludeColumns?.includes(key)
                  ),
                  "actions",
                ].map((item) => ({
                  name: item,
                  selector: (row) => <div>{row[item]}</div>,
                }))}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}
