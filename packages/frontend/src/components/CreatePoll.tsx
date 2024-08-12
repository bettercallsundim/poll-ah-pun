import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import myAxios from "@/lib/axios";
import React, { useState } from "react";

const CreatePoll = () => {
  const [options, setOptions] = useState([]);
  const [title, setTitle] = useState("");

  function handleAddOption() {
    setOptions((prev) => [...prev, ""]);
  }
  async function handlePostPoll() {
    await myAxios
      .post("/poll/create", {
        title,
        description: title,
        options,
      })
      .then((res) => {
        setOptions([]);
        setTitle("");
      });
  }
  return (
    <div>
      <div className="grid max-w-[500px] gap-1.5">
        <Label htmlFor="message-2">Your Message</Label>
        <Textarea
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Type your message here."
          id="message-2"
        />
        <p className="text-sm text-muted-foreground">
          Your message will be copied to the support team.
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
                    setOptions(newOptions);
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
