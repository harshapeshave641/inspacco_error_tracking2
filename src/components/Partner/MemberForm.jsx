import React, { useState } from "react";
import UserSearchBar from "../common/User/UserSearchBar";
import UserForm from "../common/User/NewUserForm";
import Input from "../common/neomorphic/Input";
import DynamicField from "../common/DynamicField";
import Button from "../common/neomorphic/Button";
import { fn } from "../../helpers/utils";

export default function MemberForm({
  memberId,
  onSubmit,
  memberTypes = [],
  member = {},
}) {
  const [memberType, setMemberType] = useState(member?.type || memberTypes[0]);
  const [subType, setSubType] = useState(member?.subType);
  const [userId, setUserId] = useState(member?.member?.objectId);
  return (
    <div className=" pt-2 ml-10  flxex flex-col  justify-center w-2/3">
      <div>
        <label className="label-text text-xs font-medium pb-1 text-accent">
          Link User
        </label>
        <UserSearchBar
          onSelect={(u) => {
            console.log("user", u);
            setUserId(u?.objectId);
          }}
        />
        {/* <UserSearchBar term="" onSelect={(u) => setUserId(u?.objectId)} /> */}
      </div>

      <DynamicField
        field={{
          type: "SELECT",
          value: memberType,
          name: "memberType",
          label: "Member Type",
          options: memberTypes,
          setData: (v) => {
            console.log("v", v);
            setMemberType(v.memberType);
          },
        }}
      />
      <Input
        type="text"
        value={subType}
        placeholder="Subtype"
        className={"mt-3"}
        onChange={(e) => {
          setSubType(e.target.value);
        }}
      />
      <div className="flex justify-center gap-4 mt-8">
        <Button
          type="accent"
          //   loading={loading}
          disabled={ !memberType || !userId}
          onClick={() => {
            onSubmit({
              memberType,
              subType,
              userId,
              memberId,
            });
          }}
        >
          Submit
        </Button>
        {/* <Button onClick={performCleanup}>Close</Button> */}
      </div>
      {/* <UserForm user={member?.member} onDone={onSubmit} /> */}
    </div>
  );
}
