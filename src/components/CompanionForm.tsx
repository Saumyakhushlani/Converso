"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { subjects } from "../../constants";
import { Textarea } from "@/components/ui/textarea";
import { redirect } from "next/navigation";
import { createCompanion } from "../../lib/actions/companions.actions";

const formSchema = z.object({
  name: z.string().min(1, { message: 'Companion is required.' }),
  subject: z.string().min(1, { message: 'Subject is required.' }),
  topic: z.string().min(1, { message: 'Topic is required.' }),
  voice: z.string().min(1, { message: 'Voice is required.' }),
  style: z.string().min(1, { message: 'Style is required.' }),
  duration: z.number().min(1, { message: 'Duration must be at least 1 minute.' }),
})

const CompanionForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      subject: '',
      topic: '',
      voice: '',
      style: '',
      duration: undefined as any,
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const companion = await createCompanion(values);
    if (companion?.id) {
      redirect(`/companions/${companion.id}`);
    }else{
      console.log('Failed to create companion');
      redirect('/companions/new');
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Companion name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter the companion name"
                  {...field}
                  className="input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="input capitalize">
                    <SelectValue placeholder="Select the subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem
                        value={subject}
                        key={subject}
                        className="capitalize"
                      >
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="topic"
          render={({ field }) => (
            <FormItem>
              <FormLabel>What should the companion help with?</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Ex. React Hooks & State Management"
                  {...field}
                  className="input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="voice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Voice</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="input">
                    <SelectValue
                      placeholder="Select the voice"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">
                      Male
                    </SelectItem>
                    <SelectItem value="female">
                      Female
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="style"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Style</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="input">
                    <SelectValue
                      placeholder="Select the style"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">
                      Formal
                    </SelectItem>
                    <SelectItem value="casual">
                      Casual
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="duration"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estimated session duration in minutes</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="5"
                  value={field.value !== undefined && field.value !== null ? String(field.value) : ''}
                  onChange={(e) => {
                    const value = e.target.value.trim();
                    // Allow empty string - user can clear completely
                    if (value === '') {
                      field.onChange(undefined as any);
                      return;
                    }
                    // Only allow digits
                    if (/^\d+$/.test(value)) {
                      const numValue = parseInt(value, 10);
                      if (numValue > 0) {
                        field.onChange(numValue);
                      }
                    }
                  }}
                  onBlur={(e) => {
                    field.onBlur();
                    // Only set default if still empty on blur
                    if ((e.target.value === '' || field.value === undefined || field.value === null) && !form.formState.isSubmitting) {
                      field.onChange(5);
                    }
                  }}
                  name={field.name}
                  ref={field.ref}
                  className="input"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full cursor-pointer">Build Your Companion</Button>
      </form>
    </Form>
  )
}

export default CompanionForm