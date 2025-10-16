"use client"
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import Image from 'next/image';
export default function NotAuthorized() {
    const auth = useAuth()

    const logoutall = () => {
        auth.logout()
    }
    return (
        <div className="flex items-center justify-center min-h-screen px-4">
            <div className="flex flex-col items-center text-center p-6">
                <div className="w-full max-w-md">
                    <h1 className="text-3xl font-semibold mb-3"> You are not authorized!</h1>
                    <p className="text-muted-foreground mb-4">
                        Oops! 😖 You do not have permission to view this page using the credentials that you have provided while login.
                    </p>
                    <p className="text-muted-foreground mb-4">
                        Please contact your site administrator.
                    </p>
                    <Button onClick={logoutall} >
                        Back to Login
                    </Button>
                </div>
                <Image
                    src="/images/pages/404.png"
                    alt="error-illustration"
                    className="mt-8 h-[400px] md:h-[450px] lg:h-[500px] lg:mt-10"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '50%',height:"65vh" }}
                />
            </div>
            {/* <FooterIllustrations /> */}
        </div>
    );
}