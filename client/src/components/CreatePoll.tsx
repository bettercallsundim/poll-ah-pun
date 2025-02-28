import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import myAxios from "@/lib/axios";
import { useState } from "react";

type Option = string;

// @ts-expect-error gonna fix this later
const CreatePoll = ({ setPolls }) => {
  const [options, setOptions] = useState<Option[] | []>([]);
  const [title, setTitle] = useState("");

  function handleAddOption() {
    setOptions((prev: Option[] | []) => [...prev, ""]);
  }
  async function handlePostPoll() {
    await myAxios
      .post("/poll/create", {
        title,
        description: title,
        options,
      })
      .then((res) => {
        console.log("🚀 ~ .then ~ res:", res);
        setOptions([]);
        setTitle("");
        // @ts-expect-error gonna fix this later
        setPolls((prev) => [res.data.data, ...prev]);
      });
  }

  return (
    <div className="border-b mb-12">
      <div className="grid max-w-2xl gap-1.5 md:border md:border-slate-200 md:px-12 md:py-8 rounded-xl mb-8">
        <Label htmlFor="message-2 mb-4">Create your poll</Label>
        <Textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Describe what's your poll about"
          id="message-2"
        />
        <p className="text-sm text-muted-foreground">
          Add minimum 2 / maximum 4 options
        </p>
        <div className="flex flex-col gap-y-4">
          {options?.map((option, ind) => (
            <div key={ind}>
              <Input
                value={option}
                onChange={(e) =>
                  setOptions((prev) => {
                    const newOptions = [...prev];
                    newOptions[ind] = e.target.value;
                    return newOptions;
                  })
                }
                placeholder="Type your message here."
                id="message-2"
              />
            </div>
          ))}
        </div>
        <div className="flex gap-x-4 items-center mt-4">
          <Button disabled={options.length == 4} onClick={handleAddOption}>
            + Add Options
          </Button>
          <Button disabled={options.length < 2} onClick={handlePostPoll}>
            Post Poll
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreatePoll;
