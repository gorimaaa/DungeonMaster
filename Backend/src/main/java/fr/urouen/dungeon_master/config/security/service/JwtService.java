package fr.urouen.dungeon_master.config.security.service;

import fr.urouen.dungeon_master.config.security.JwtConfig;
import fr.urouen.dungeon_master.enums.TokenType;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

@Service
public class JwtService {
    private final JwtConfig jwtConfig;

    public JwtService(JwtConfig jwtConfig) {
        this.jwtConfig = jwtConfig;
    }

    private String generateToken(String username, long expiration, TokenType tokenType) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("type", tokenType);
        return Jwts.builder()
                .claims()
                .add(claims)
                .subject(username)
                .issuedAt(new Date(System.currentTimeMillis()))
                .issuer(jwtConfig.getIssuer())
                .expiration(new Date(System.currentTimeMillis() + expiration))
                .and()
                .signWith(getKey())
                .compact();

    }

    public String generateAccessToken(String username) {
        return generateToken(username, jwtConfig.getAccessExpiration(), TokenType.ACCESS);
    }

    public String generateRefreshToken(String username) {
        return generateToken(username, jwtConfig.getRefreshExpiration(), TokenType.REFRESH
        );
    }

    private SecretKey getKey() {
        byte[] keyBytes = Decoders.BASE64.decode(jwtConfig.getSecret());
        return Keys.hmacShaKeyFor(keyBytes);
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    private <T> T extractClaim(String token, Function<Claims, T> claimResolver) {
        final Claims claims = extractAllClaims(token);
        return claimResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean validateToken(String token, UserDetails userDetails) {
        final String userName = this.extractUsername(token);
        return (userName.equals(userDetails.getUsername()) && isTokenExpired(token));
    }
    private boolean isRefreshToken(String token) {
        return "REFRESH".equals(extractClaim(token, claims -> claims.get("type", String.class)));
    }

    public boolean isValidRefreshToken(String token) {
        return isRefreshToken(token) && isTokenExpired(token);
    }
    private boolean isTokenExpired(String token) {
        return !extractExpiration(token).before(new Date());
    }

    private Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }
}

