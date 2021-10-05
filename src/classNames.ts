export function classNames(...classes: ReadonlyArray<string | undefined>) {
    return classes.filter(c => c != null).join(" ");
}
