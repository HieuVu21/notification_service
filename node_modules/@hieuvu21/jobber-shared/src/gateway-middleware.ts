import jwt from 'jsonwebtoken';
import { NotAuthorizeError } from './error-handler';
import { Request, Response, NextFunction } from 'express';
const tokens: string[] = [
  'auth',
  'gig',
  'seller',
  'search',
  'buyer',
  'message',
  'order',
  'review',
];

export function verifyGatewayRequest(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  if (!req.headers?.gatewayToken) {
    throw new NotAuthorizeError(
      'invalid request',
      'request not coming from api gateway'
    );
  }
  const token: string = req.headers?.gatewayToken as string;
  if (!token) {
    throw new NotAuthorizeError(
      'invalid request',
      'request not coming from api gateway'
    );
  }
  try {
    const payload: { id: string; iat: number } = jwt.verify(token, '') as {
      id: string;
      iat: number;
    };
    if (!token.includes(payload.id)) {
      throw new NotAuthorizeError('invalid request', 'payload invalid');
    }
  } catch (error) {
    throw new NotAuthorizeError(
      'invalid request',
      'request not coming from api gateway'
    );
  }
}
