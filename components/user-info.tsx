import { User, UserRole } from "@prisma/client";
import { Card, CardContent, CardHeader } from "./ui/card";
import { DefaultSession } from "next-auth";
import { Console } from "console";
import { Badge } from "./ui/badge";

interface UserInfoProps{
  user?: DefaultSession["user"]
  label: string;
}


const UserInfo = ({user, label}: UserInfoProps) => {
  // console.log(user?.isTwoFactorEnabled)
  return (
    <Card className="w-[600px] shadow-md">
      <CardHeader>
        <p className="text-2xl font-semibold text-center">
          {label}
        </p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="flex justify-between shadow-sm rounded-lg items-center border p-3 flex-row">
          <p className="font-medium text-sm">
            ID
          </p>
          <p className="text-xs truncate max-w-[180px] font-mono bg-slate-100 p-1 rounded-lg">
            {user?.id}
          </p>
        </div>

        <div className="flex justify-between shadow-sm rounded-lg items-center border p-3 flex-row">
          <p className="font-medium text-sm">
            Name
          </p>
          <p className="text-xs truncate max-w-[180px] font-mono bg-slate-100 p-1 rounded-lg">
            {user?.name}
          </p>
        </div>

        <div className="flex justify-between shadow-sm rounded-lg items-center border p-3 flex-row">
          <p className="font-medium text-sm">
            Email
          </p>
          <p className="text-xs truncate max-w-[180px] font-mono bg-slate-100 p-1 rounded-lg">
            {user?.email}
          </p>
        </div>

        <div className="flex justify-between shadow-sm rounded-lg items-center border p-3 flex-row">
          <p className="font-medium text-sm">
            Role
          </p>
          <p className="text-xs truncate max-w-[180px] font-mono bg-slate-100 p-1 rounded-lg">
            {user?.role}
          </p>
        </div>

        <div className="flex justify-between shadow-sm rounded-lg items-center border p-3 flex-row">
          <p className="font-medium text-sm">
            2FA
          </p>
          <Badge variant={user?.isTwoFactorEnabled ? "default": "destructive"}>
            {user?.isTwoFactorEnabled ? "Enabled" : "Disabled"}
          </Badge>
        </div>
      </CardContent>
    </Card>
  )
}


export default UserInfo;