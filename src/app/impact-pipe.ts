import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'impact'
})
export class ImpactPipe implements PipeTransform {
    transform(value: boolean): unknown {
        return value ? 'Positive' : 'Negative';
    }
}
