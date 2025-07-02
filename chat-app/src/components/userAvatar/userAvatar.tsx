import Image, { ImageProps } from "next/image"

export default function UserAvatar({ className, src, width, height, ...rest }: ImageProps) {
    return <Image
        priority
        src={src || '/images/no-pfp.jpg'}
        width={width || 200}
        height={height || 200}
        {...rest}
        className={`rounded-full ${className || ''}`}
        />
}