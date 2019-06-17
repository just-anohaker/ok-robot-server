export async function delay(duration_ms): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => resolve(), duration_ms);
    });
}