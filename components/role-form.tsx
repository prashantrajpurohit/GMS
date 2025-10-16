import React from 'react'
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Switch } from './ui/switch';
import { DialogClose, DialogFooter } from './ui/dialog';
import { Button } from './ui/button';
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { RoleApis } from '@/lib/controller/httpApis';
import { toast } from 'sonner';
import { Loader } from 'lucide-react';

const { AddRoleNames, editRoleNames } = new RoleApis()

const schema = z.object({
    id: z.string().optional(),
    name: z.string({ required_error: "Name is required" }),
    is_active: z.boolean()
})

type FormData = z.infer<typeof schema>

const RoleForm = ({ getData,setOpenModal,setGetData }: { getData: any | null,setGetData:any,setOpenModal:any }) => {
    const queryClient = useQueryClient()

    const { handleSubmit, register, formState: { errors }, setValue, clearErrors, reset, getValues } = useForm<FormData>({
        resolver: zodResolver(schema), defaultValues: getData ?? {
            id: '',
            is_active: true,
            name: undefined
        }
    })

    const { mutate, isPending } = useMutation({
        mutationFn: (data: FormData) => {
            let obj = { name: data.name, is_active: data.is_active }
            if (data?.id) {
                return editRoleNames({ id: data?.id, body: obj })
            } else {
                return AddRoleNames(obj)
            }

        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ["roleNames"] })
            toast.success(`${data?.message}`)
            setOpenModal(false)
            setGetData(null)
            reset()
        }
    })

    const onSubmit = (data: FormData) => {
        mutate(data);
    }



    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
                <div className="grid gap-3 mt-2">
                    <Label className='mb-2'>Designation Name</Label>
                    <Input defaultValue={getValues("name")} onChange={(e) => {
                        setValue("name", e.target.value)
                        clearErrors("name")
                    }} />
                    {!!(errors?.name) && <p className="text-sm text-red-500">{errors?.name?.message}</p>}
                </div>
                <div className="grid gap-6 mt-1">
                    <div className="flex items-center space-x-2">
                        <Switch id="Status" checked={true} />
                        <Label htmlFor="Status">Status</Label>
                    </div>
                </div>
            </div>
            <div className="grid gap-4 mt-2">
                <DialogFooter style={{ display: "flex", justifyContent: "space-between", marginTop: 10 }}>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={isPending}>
                        {isPending && <Loader className="animate-spin" />} Submit
                    </Button>
                </DialogFooter>
            </div>
        </form>
    )
}

export default RoleForm