import { Topic } from '../domain/topic';
import { PaginationResponse } from 'src/common/dto/query-pagination.dto';

export class GetTopicsResponse extends PaginationResponse<Topic> {}
