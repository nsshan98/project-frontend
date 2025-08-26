export async function refreshAccessToken(token: any) {
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({refreshToken: token.refreshToken})
        })

        const refreshed = await res.json()
        if(!res.ok) throw refreshed

        return {
            ...token,
            accessToken: refreshed.accessToken,
            accessTokenExpires: Date.now() + refreshed.expiresIn * 1000,
            refreshToken: refreshed.refreshToken ?? token.refreshToken
        }
    } catch (error) {
        console.log('Refresh token error', error)
        return {...token, error: 'RefreshAccessTokenError'}
    }
}