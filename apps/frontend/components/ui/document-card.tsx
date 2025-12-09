import type { EmployeeInfo } from '@/types'
import { Calendar, RefreshCcw, User } from 'lucide-react'
import { DateTime } from 'luxon'
import { FileIcon, defaultStyles } from 'react-file-icon'

const extensions = ["pdf", "xlsx", "docx", "txt", "pptx", "odt"] as const

type DocumentCardRootProps = React.HTMLAttributes<HTMLDivElement> & {
    children: React.ReactNode
}

type DocumentCardExtensionProps = React.HTMLAttributes<HTMLDivElement> & {
    extension: (typeof extensions)[number]
}

type DocumentCardInfoProps = React.HTMLAttributes<HTMLDivElement> & {
    name?: string,
    createdAt?: string | Date;
    lastUpdatedAt?: string | Date;
    owner?: EmployeeInfo,
    compact?: boolean
}

type DocumentCardSkeletonProps = {
    compact?: boolean;
};

const DocumentCardRoot = ({ children, ...rest }: DocumentCardRootProps) => {
    return (
        <div {...rest}
            className={`${rest.className} cursor-pointer flex flex-col flex-wrap`}>
            {children}
        </div>
    )
}

const DocumentCardExtension = ({ extension, ...rest }: DocumentCardExtensionProps) => {
    return (
        <div {...rest}>
            <FileIcon extension={extension} {...defaultStyles[extension]} />
        </div>
    )
}


const formatFull = (date?: string | Date) => {
    if (!date) return null
    if (date instanceof Date)
        return DateTime.fromJSDate(date).toFormat("dd/MM/yyyy HH:mm")
    return DateTime.fromISO(date).toFormat("dd/MM/yyyy HH:mm")
}

const DocumentCardInfo = ({
    name,
    createdAt,
    lastUpdatedAt,
    owner,
    compact = false,
    ...rest
}: DocumentCardInfoProps) => {
    const formatRelative = (date?: string | Date) => {
        if (!date) return null
        const dt =
            date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromISO(date)
        return dt.toRelative() ?? "Just now"
    }

    const isRecentlyUpdated = (date?: string | Date) => {
        if (!date) return false
        const dt =
            date instanceof Date ? DateTime.fromJSDate(date) : DateTime.fromISO(date)
        return DateTime.now().diff(dt, "seconds").seconds < 10
    }

    const showPulse = isRecentlyUpdated(lastUpdatedAt)

    return (
        <div
            {...rest}
            className={`${rest.className} flex flex-col ${compact ? "gap-1 pt-2" : "gap-2 pt-3"
                } w-full`}>
            {name && (
                <div
                    className={`text-foreground font-semibold ${compact ? "text-sm" : "text-md"
                        } w-full text-ellipsis overflow-hidden whitespace-nowrap text-center select-none`}
                >
                    {name}
                </div>
            )}

            {(createdAt || lastUpdatedAt) && (
                <div
                    className={`flex flex-col ${compact ? "gap-0.5 text-[10px]" : "gap-1 text-[11px]"
                        } text-foreground/50`}
                >
                    {createdAt && (
                        <div
                            className="flex items-center justify-center gap-1"
                            title={`Created at: ${formatFull(createdAt)}`}
                        >
                            <Calendar size={11} />
                            <span>{formatRelative(createdAt)}</span>
                        </div>
                    )}

                    {lastUpdatedAt && (
                        <div
                            title={`Last updated: ${formatFull(lastUpdatedAt)}`}
                            className={`flex items-center justify-center gap-1 font-semibold text-foreground/70 ${showPulse ? "relative" : ""
                                }`}
                        >
                            {showPulse && (
                                <span className="absolute -left-2 w-2 h-2 rounded-full bg-(--theme-primary) animate-ping" />
                            )}
                            <RefreshCcw size={11} />
                            <span>{formatRelative(lastUpdatedAt)}</span>
                        </div>
                    )}
                </div>
            )}

            {owner && !compact && (
                <div className="mt-3 flex justify-center items-center gap-2 select-none">
                    <div className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center">
                        <User size={18} />
                    </div>
                    <div className="text-xs text-foreground/70 font-semibold">
                        {owner.firstName}, {owner.lastName}
                    </div>
                </div>
            )}
        </div>
    )
}

function DocumentCardSkeleton({
    compact = false,
}: DocumentCardSkeletonProps) {
    return (
        <div
            className={`
        w-[12%] min-w-[140px]
        cursor-default flex flex-col items-center p-4
        rounded-md bg-muted/20 animate-pulse
      `}
        >
            <div
                className={`
          ${compact ? "w-12 h-12" : "w-16 h-16"}
          bg-muted rounded-md mb-3
        `}
            />

            <div
                className={`
          h-3 bg-muted rounded
          ${compact ? "w-3/4" : "w-full"}
          mb-2
        `}
            />

            <div className="h-2 w-1/2 bg-muted rounded mb-1" />

            <div className="h-2 w-1/3 bg-muted rounded mb-2" />

            {!compact && (
                <div className="mt-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-muted" />
                    <div className="h-3 w-20 bg-muted rounded" />
                </div>
            )}
        </div>
    );
}

const DocumentCard = Object.assign(DocumentCardRoot, {
    Extension: DocumentCardExtension,
    Info: DocumentCardInfo,
    Loading: DocumentCardSkeleton,
})

export default DocumentCard;