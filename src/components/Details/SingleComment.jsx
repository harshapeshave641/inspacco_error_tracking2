import { useEffect, useState } from "react";
import Button from "../common/neomorphic/Button";
import PencilIcon from "@heroicons/react/24/solid/PencilIcon";

const SingleComment = ({ comment, onSubmit, id }) => {
  const [value, setValue] = useState(comment);
  const [editMode, setEditMode] = useState(false);
  useEffect(() => {
    setValue(comment);
    setEditMode(false);
  }, [id]);
  return (
    <div>
      {editMode ? (
        <div className="flex items-center justify-center gap-2">
          <ReactiveInput
            value={value}
            onSubmit={(v) => {
              onSubmit(v);
              setEditMode(false);
            }}
          />
          <Button type="ghost" onClick={(e) => setEditMode(false)}>
            Close
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <div>{comment || "No Comment yet!"} </div>
          <Button
            type="ghost"
            className="gap-2"
            onClick={(e) => setEditMode(true)}
          >
            <PencilIcon className="cursor-pointer h-4 w-4 inline-block" />
            Edit
          </Button>
        </div>
      )}
    </div>
  );
};

export default SingleComment;
